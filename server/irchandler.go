package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/nexes/goirc"
)

type ircHandler struct {
	open bool

	conn *websocket.Conn
	irc  goirc.Client
}

type clientInfo struct {
	ServerName string `json:"server"`
	Nick       string `json:"nick"`
	Pass       string `json:"pass,omitempty"`
}

func (i *ircHandler) ircResponses() {
	i.irc.Listen()

	for i.irc.IsOpen() {
		fmt.Println("waiting in ircResponse")
		select {
		case fromSrv := <-i.irc.RecvServerMessage():
			//send over websocket
			fmt.Println(fromSrv["MSG"])
		}
	}
}

func (i *ircHandler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodPost:
		var info clientInfo
		dec := json.NewDecoder(req.Body)
		dec.Decode(&info)

		if i.open {
			res.Header().Set("Content-Type", "application/json")
			res.Write([]byte("{response: 'connection already open'}"))
			return
		}

		i.irc = goirc.Client{
			Nick:     info.Nick,
			Server:   info.ServerName,
			Password: info.Pass,
		}

		//TDOD these resp should be json not text
		err := i.irc.ConnectToServer()
		if err != nil {
			fmt.Println(err.Error())
			res.Header().Set("Content-Type", "application/json")
			res.Write([]byte("{'response': 'error man'}"))

		} else {
			i.open = true
			res.Header().Set("Content-Type", "application/json")
			res.Write([]byte("{'response': 'good to go man'}"))
		}

	case http.MethodGet:
		var upgrader = websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}

		if i.open {
			conn, err := upgrader.Upgrade(res, req, nil)
			if err != nil {
				fmt.Printf("error with server ws %s", err.Error())
				return
			}
			i.conn = conn
			go i.ircResponses()

			res.Header().Set("Content-Type", "application/json")
			res.Write([]byte("{'response': 'listening'}"))
		} else {
			res.Header().Set("Content-Type", "application/json")
			res.Write([]byte("{'response': 'send POST request first"))
		}

	default:
		fmt.Println("nope ")
	}
}

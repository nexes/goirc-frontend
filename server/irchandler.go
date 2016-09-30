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

//holds client data for IRC, received from the POST request
type clientInfo struct {
	ServerName string `json:"server"`
	Nick       string `json:"nick"`
	Pass       string `json:"pass,omitempty"`
}

//json struct that will be sent in responses
type responseData struct {
	response string
	status   int
}

//this will receive irc data from goirc and send it up through a websocket
func (i *ircHandler) ircResponses() {
	i.irc.Listen()
	defer i.irc.CloseConnection("bye goirc")
	defer i.conn.Close()

	for i.irc.IsOpen() {
		select {
		case fromSrv := <-i.irc.RecvServerMessage():
			err := i.conn.WriteJSON(fromSrv)
			if err != nil {
				fmt.Printf("error sending over websocket %s", err.Error())
			}

		case fromChannel := <-i.irc.RecvChannelMessage():
			err := i.conn.WriteJSON(fromChannel)
			if err != nil {
				fmt.Printf("error sending over websocket %s", err.Error())
			}

		case fromMsg := <-i.irc.RecvPrivMessage():
			err := i.conn.WriteJSON(fromMsg)
			if err != nil {
				fmt.Printf("error sending over websocket %s", err.Error())
			}
		}
	}
}

//handle POST and GET. POST will have the users nick, password and server name, this needs
//to bee called before GET request. GET will upgrade from the HTTP protocol to the ws protocol
func (i *ircHandler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	encdr := json.NewEncoder(res)

	switch req.Method {
	case http.MethodPost:
		var info clientInfo
		dec := json.NewDecoder(req.Body)
		dec.Decode(&info)

		//do i need this
		if i.open {
			encdr.Encode(responseData{response: "connection already open", status: 500})
			return
		}

		i.irc = goirc.Client{
			Nick:     info.Nick,
			Server:   info.ServerName,
			Password: info.Pass,
		}

		err := i.irc.ConnectToServer()
		if err != nil {
			fmt.Println(err.Error())
			encdr.Encode(responseData{response: "Error connectingto IRC", status: 500})

		} else {
			i.open = true
			fmt.Println("sending OK status")
			encdr.Encode(responseData{response: "IRC connection open", status: 200})
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
				encdr.Encode(responseData{response: "Error upgrading to ws protocol", status: 500})
				return
			}
			i.conn = conn

			go i.ircResponses()
			encdr.Encode(responseData{response: "listening", status: 200})

		} else {
			encdr.Encode(responseData{response: "send POST request first", status: 500})
		}

	default:
		fmt.Println("nope ")
	}
}

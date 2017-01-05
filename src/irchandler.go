package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/nexes/goirc"
)

//our object that makes a connection to our goirc API and the websocket to communicate over
type ircHandler struct {
	irc  goirc.Client
	conn *websocket.Conn
}

//holds client data for IRC, received from the POST request
type clientInfo struct {
	ServerName string `json:"server"`
	Nick       string `json:"nick"`
	Pass       string `json:"pass,omitempty"`
}

//json struct that will be sent in responses to the client
type responseData struct {
	response string
	status   int
}

//json struct that will be received from the client
type requestData struct {
	Command string `json:"command"`
	Data    string `json:"data"`
	Room    string `json:"channel"`
}

//this will receive irc data from goirc and send it up through a websocket
func (i *ircHandler) ircResponses() {
	i.irc.Listen()
	defer i.irc.CloseConnection("bye goirc")
	defer i.conn.Close()

	for {
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

//ircRequest will handle readng from the websocket
func (i *ircHandler) ircRequest() {
	var requestIRC requestData
	i.conn.SetReadLimit(1024)

	for {
		_, data, err := i.conn.ReadMessage()
		if err != nil {
			fmt.Printf("Server error receiving message: %s", err.Error())
		}
		//data is a json string
		er := json.Unmarshal(data, &requestIRC)
		if er != nil {
			fmt.Printf("Error marshaling json request from client: %s", er.Error())
		}

		//refractor this list of if's else if's
		if strings.EqualFold(requestIRC.Command, "write") {
			fmt.Printf("channel = %s, data = %s\n", requestIRC.Room, requestIRC.Data)
			channel := i.irc.GetChannel(requestIRC.Room)

			if channel != nil {
				channel.SendMessage(requestIRC.Data)
			} else {
				fmt.Println("channel is nil")
			}

		} else if strings.EqualFold(requestIRC.Command, "join") {
			fmt.Printf("requestIRC.Room = %s, requestIRC.Data = %s\n", requestIRC.Room, requestIRC.Data)
			_, err := i.irc.JoinChannel(requestIRC.Room)

			if err != nil {
				fmt.Printf("Error joining room %s\n", err.Error())
			}

		} else if strings.EqualFold(requestIRC.Command, "pong") {
			i.irc.SendPongResponse()

		} else if strings.EqualFold(requestIRC.Command, "part") {
			chn := i.irc.GetChannel(requestIRC.Room)

			if chn != nil {
				fmt.Printf("channel found: %s\n", chn.Name)
				i.irc.LeaveChannel(chn, "Bye people")
			}
		}
	}
}

//handle POST and GET. POST will have the users nick, password and server name, this needs
//to be called before GET request. GET will upgrade from the HTTP protocol to the ws protocol
func (i *ircHandler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	encdr := json.NewEncoder(res)

	switch req.Method {
	case http.MethodPost:
		var info clientInfo
		dec := json.NewDecoder(req.Body)
		dec.Decode(&info)

		i.irc = goirc.Client{
			Nick:     info.Nick,
			Server:   info.ServerName,
			Password: info.Pass,
		}

		err := i.irc.ConnectToServer()
		if err != nil {
			fmt.Println(err.Error())
			encdr.Encode(responseData{response: "Error connectingto IRC", status: 500})
			return
		}

		encdr.Encode(responseData{response: "IRC connection open", status: 200})

	case http.MethodGet:
		var upgrader = websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}

		conn, err := upgrader.Upgrade(res, req, nil)
		if err != nil {
			fmt.Printf("error with server ws %s", err.Error())
			encdr.Encode(responseData{response: "Error upgrading to ws protocol", status: 500})
			return
		}
		i.conn = conn

		go i.ircResponses()
		go i.ircRequest()
		encdr.Encode(responseData{response: "listening", status: 200})

	default:
		fmt.Println("nope")
	}
}

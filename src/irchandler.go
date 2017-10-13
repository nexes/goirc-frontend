package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/nexes/goirc"
)

//IRCHandler object that makes a connection to our goirc API and the websocket to communicate over
type IRCHandler struct {
	irc  goirc.Client
	conn *websocket.Conn
}

//ClientInfo holds client data for IRC, received from the POST request
type ClientInfo struct {
	ServerName string `json:"server"`
	Nick       string `json:"nick"`
	Pass       string `json:"pass,omitempty"`
}

//ResponseData json struct that will be sent in responses to the client
type ResponseData struct {
	response string
	status   int
}

//json struct that will be received from the client
type requestData struct {
	Command string `json:"command"`
	Data    string `json:"data"`
	Room    string `json:"channel"`
}

//NewIRCHandler returns a new IRC handler, used to ineract with the IRC library. Pass is the only optional parameter
func NewIRCHandler(nick, server, pass string) (*IRCHandler, error) {
	i := &IRCHandler{}
	i.irc = goirc.Client{
		Nick:     nick,
		Server:   server,
		Password: pass,
	}

	err := i.irc.ConnectToServer()
	if err != nil {
		return nil, err
	}

	return i, nil
}

//CreateWebSocket function to upgrade the GET request to a websocket
func (i *IRCHandler) CreateWebSocket(res http.ResponseWriter, req *http.Request) error {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	wsocket, err := upgrader.Upgrade(res, req, nil)
	if err != nil {
		fmt.Printf("error with server ws %s", err.Error())
		return err
	}
	i.conn = wsocket

	go i.ircResponses()
	go i.ircRequest()

	return nil
}

//this will receive irc data from goirc and send it up through a websocket
func (i *IRCHandler) ircResponses() {
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
func (i *IRCHandler) ircRequest() {
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

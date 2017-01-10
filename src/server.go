package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

var (
	nick       = ""
	servername = ""
	pass       = ""
)

func ircHandleFunc(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	encdr := json.NewEncoder(res)

	switch req.Method {
	case http.MethodPost:
		var info clientInfo

		dec := json.NewDecoder(req.Body)
		dec.Decode(&info)

		nick = info.Nick
		servername = info.ServerName
		pass = info.Pass

		encdr.Encode(responseData{response: "IRC connection open", status: 200})

	case http.MethodGet:
		client, err := NewIRCHandler(nick, servername, pass)
		if err != nil {
			fmt.Printf("error from NewIRCHandler %s\n", err.Error())
			encdr.Encode(responseData{response: "Error creating IRC handler", status: 500})
			return
		}

		sockErr := client.CreateWebSocket(res, req)
		if sockErr != nil {
			fmt.Printf("error with CreateWebSocket %s", err.Error())
			encdr.Encode(responseData{response: "Error upgrading to ws protocol", status: 500})
			return
		}

		encdr.Encode(responseData{response: "listening", status: 200})

	default:
		fmt.Println("nope")
	}
}

func main() {
	port := ":" + os.Getenv("PORT")
	if port == ":" {
		port = ":8080"
	}

	server := &http.Server{
		Addr: port,
		//these are abitrary right now, we will find a time that means something
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	http.HandleFunc("/api/irc/connect", ircHandleFunc)
	http.Handle("/", http.FileServer(http.Dir("app/static")))

	err := server.ListenAndServe()
	if err != nil {
		fmt.Printf("Error ListenAndServe %s\n", err.Error())
	}
}

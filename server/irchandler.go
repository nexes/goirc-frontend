package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/nexes/goirc"
)

type ircHandler struct {
	nick   string
	pass   string
	server string

	irc goirc.Client
}

type serverInfo struct {
	ServerName string `json:"server"`
	Nick       string `json:"nick"`
	Pass       string `json:"pass,omitempty"`
}

func (i *ircHandler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodPost {
		var info serverInfo
		dec := json.NewDecoder(req.Body)
		dec.Decode(&info)

		fmt.Printf("server: %s, nick %s, pass %s\n", info.ServerName, info.Nick, info.Pass)

		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{response: 'okay'}"))
	}

	if req.Method == http.MethodGet {
		fmt.Fprintf(res, "Hello man")
	}
}

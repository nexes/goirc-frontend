package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	irc := &ircHandler{}
	server := &http.Server{
		Addr: ":8080",
		//these are abitrary right now, we will find a time that means something
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	http.Handle("/api/irc/connect", irc)
	http.Handle("/", http.FileServer(http.Dir("app/static")))

	err := server.ListenAndServe()
	if err != nil {
		fmt.Printf("Error ListenAndServe %s\n", err.Error())
	}
}

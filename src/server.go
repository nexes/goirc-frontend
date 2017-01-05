package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

func main() {
	port := ":" + os.Getenv("PORT")
	if port == ":" {
		port = ":8080"
	}

	irc := &ircHandler{}
	server := &http.Server{
		Addr: port,
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

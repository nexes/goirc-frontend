package main

import (
	"log"
	"net/http"
)

func rootHandler(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("hello golang server"))
}

func main() {
	http.HandleFunc("/", rootHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Error connecting %s", err.Error())
	}

	log.Println("Listening on port 8080")
}

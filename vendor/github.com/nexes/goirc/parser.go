package goirc

import (
	"fmt"
	"strconv"
	"strings"
)

//FormatPrivMsg will format the data given to better print the privmsg
func FormatPrivMsg(ch, nick, msg string) string {
	return fmt.Sprintf("[%s] %s | %s", ch, nick, msg)
}

//most server responses will be of the format, [server name:string][ID:int][stuff:string]
//if we get an error, than its a response that doesn't have a server response ID, we can ignore it from here
func getResponseID(line string) int {
	token := strings.Split(line, " ")

	if i, err := strconv.Atoi(token[1]); err == nil {
		return i
	}
	//if not found return 999
	return 999
}

//this is called to check if there has been a JOIN QUIT CHANGE event for a user
//function name may change
func checkChannelNicks(line string) (change bool, event, user, channel string) {
	token := strings.Split(line, " ")
	change = false

	if strings.EqualFold(token[1], "quit") {
		event = "quit"
		user = token[0][:strings.Index(token[0], "!")]
		change = true
		channel = "" //channel isn't given from IRC when a user quits

	} else if strings.EqualFold(token[1], "join") {
		event = "join"
		user = token[0][:strings.Index(token[0], "!")]
		change = true
		channel = token[len(token)-1]

	} else if strings.EqualFold(token[1], "nick") {
		nicks := []string{
			//old nick
			token[0][:strings.Index(token[0], "!")],
			//new nick
			token[2],
		}
		change = true
		event = "nick"
		channel = "" //channel isn't give from IRC when a user changes nick
		user = strings.Join(nicks, " ")
	}
	return
}

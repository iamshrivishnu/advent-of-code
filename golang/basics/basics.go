package basics

import (
	"fmt"
	"io/ioutil"
)

func GetFileData(filename string) string {
	content, err := ioutil.ReadFile(filename) // the file is inside the local directory
	if err != nil {
		fmt.Println("Error reading the file")
		return ""
	}
	return string(content)
}

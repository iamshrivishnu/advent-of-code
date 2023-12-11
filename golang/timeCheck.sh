#!/bin/bash
START=$(date +%s)                                                                                       
go run main.go
END=$(date +%s)
DIFF=$(( $END - $START ))
echo "It took $DIFF seconds"
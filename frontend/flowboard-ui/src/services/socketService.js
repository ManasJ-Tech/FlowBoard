import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


let stompClient = null;



export function connectSocket(onMessageReceived) {


    stompClient = new Client({

        webSocketFactory: () =>
            new SockJS(
                "http://localhost:8080/ws"
            ),


        reconnectDelay: 5000,


        onConnect: () => {


            console.log(
                "WebSocket Connected"
            );


            stompClient.subscribe(
                "/topic/topic",

                (message) => {


                    const data =
                        JSON.parse(message.body);



                    console.log(
                        "WebSocket Update:",
                        data
                    );



                    onMessageReceived(data);

                }

            );


        },


        onStompError: (error) => {

            console.error(
                "WebSocket Error:",
                error
            );

        }

    });



    stompClient.activate();

}




export function disconnectSocket(){


    if(stompClient){

        stompClient.deactivate();


        console.log(
            "WebSocket Disconnected"
        );

    }

}
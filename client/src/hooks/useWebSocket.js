import React, {useContext, useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {AuthContext} from "../contexts/AuthProvider";

export const useWebSocket = ({
                               onDirectMessage,
                               onPublicMessage
                             }) => {
  const {authState} = useContext(AuthContext);
  const [client, setClient] = useState(null);
  const subscriptionsRef = useRef([]);

  useEffect(() => {
    if (!authState.accessToken) {
      return;
    }
    if (client && client.connected) {
      return;
    }
    const getConnection = async () => {

      const socket = new SockJS(`http://localhost:8080/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${authState.accessToken}`,
          'heart-beat': '2000,2000'
        },
        reconnectDelay: 2000,
        heartbeatIncoming: 2000,
        heartbeatOutgoing: 5000,
        onConnect: () => {
          console.log(`Connected to WebSocket`)
          const publicSub = client.subscribe(
            '/topic/public',
            onPublicMessage,
            {id: `${authState.user.username}-public-subscription`}
          );
          const directMessagesSub = client.subscribe(
            `/queue/${authState.user.username}.messages`,
            onDirectMessage,
            {id: `${authState.user.username}-direct-messages-subscription`}
          );

          subscriptionsRef.current = [publicSub, directMessagesSub];
        },
        onStompError: (err) => {
          console.error("WebSocket error:", err);
        },
        onDisconnect: () => {
          console.log(`Subs size = ${subscriptionsRef.current.length}`)
          subscriptionsRef.current.forEach(async sub => {

            const response = sub.unsubscribe(
              {
                Authorization: `Bearer ${authState.accessToken}`
              }
            );
            console.log(response)
          });
          console.log(`Disconnected from WebSocket`)
          subscriptionsRef.current = [];
        }
      });
      client.activate();
      setClient(client);

    }
    getConnection();

    return () => {
      if (client && client.connected) {
        client.deactivate().then(() => {
          setClient(null);
        });
      }
    };
  }, [authState.accessToken]);

  return client;
};
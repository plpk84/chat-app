import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

export const useWebSocket = ({
                               authState,
                               onDirectMessage,
                               onPublicMessage
                             }) => {
  const [client, setClient] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (!authState.accessToken) {
      if (client) {
        client.deactivate().then(() => {
          setClient(null);
        });
      }
      return;
    }
    const getConnection = async () => {

      const socket = new SockJS(`http://localhost:8080/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${authState.accessToken}`,
          'heart-beat': '3000,3000'
        },
        onConnect: () => {
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

          setSubscriptions([publicSub, directMessagesSub]);
        },
        onStompError: (err) => {
          console.error("WebSocket error:", err);
        },
        onDisconnect: () => {
          console.log(`Disconnected from WebSocket`)
          subscriptions.forEach(sub => sub.unsubscribe(
            {
              Authorization: `Bearer ${authState.accessToken}`
            }
          ));
          setSubscriptions([]);
        },
        reconnectDelay: 3000,
        heartbeatIncoming: 3000,
        heartbeatOutgoing: 3000
      });
      setClient(client);
      client.activate();

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
import { CompatClient, Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as S from './style';
import { Button, ButtonBack, ChatMessage, ChatScreen, Header, TextLabel } from 'components';
import { instance } from 'apis';
import { useChattingDetailData } from 'hooks/queries/chatting/useChattingDetailData';
import { levelUrlArr } from 'utils/levelUrlArr';
import { Input } from 'components/molcule/chat-input/style';
import { ChattingType } from 'types/chattingType';
import useWebSocket from 'hooks/useWebsocket';

interface ChatHistoryProps {
  sender_id: number;
  sender_nick_name: string;
  profile_image: string[];
  message: string;
  timestamp: string;
  is_mine: boolean;
  sender_type: string;
}

const Test = () => {
  const { id: chat_rood_id } = useParams();
  const { data: chattingDetaildata } = useChattingDetailData(chat_rood_id as string);
  const [inputValue, setInputValue] = useState('');

  const client = useWebSocket(chat_rood_id);

  const sendHandler = () => {
    // client.current가 존재하고 연결되었다면 메시지 전송
    if (client.current && client.current.connected) {
      client.current.send(
        `/pub/api/chat/message/${chat_rood_id}`,
        { 'Content-Type': 'application/json' },
        // JSON 형식으로 전송한다
        JSON.stringify({
          sender_id: 2,
          sender_nick_name: '미정',
          profile_image: [
            'https://i.pinimg.com/564x/f1/0e/82/f10e820b22a9baa8807e4ed75ae6035a.jpg',
          ],
          message: inputValue,
          timestamp: '오후 5:40',
          is_mine: true,
          sender_type: 'customer',
        })
      );
      console.log('Message sent:', {
        sender_id: 2,
        sender_nick_name: '미정',
        profile_image: ['https://i.pinimg.com/564x/f1/0e/82/f10e820b22a9baa8807e4ed75ae6035a.jpg'],
        message: inputValue,
        timestamp: '오후 5:40',
        is_mine: true,
        sender_type: 'customer',
      });
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <>
      <Header>
        <ButtonBack className="left" $marginLeft="10px" />
        <S.HeaderProfile>
          <p>{chattingDetaildata?.customer_nick_name}</p>
          <img src={levelUrlArr(chattingDetaildata?.customer_level)} alt="profile level" />
        </S.HeaderProfile>
      </Header>

      <S.Content>
        <S.ChatContainer>
          {chattingDetaildata?.message_info_list &&
            chattingDetaildata?.message_info_list.map((message: ChattingType, i: number) => (
              <ChatMessage messageData={message} key={i} />
            ))}
        </S.ChatContainer>
      </S.Content>

      <S.Footer>
        +
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={sendHandler}>전송</button>
      </S.Footer>
    </>
  );
};

export default Test;

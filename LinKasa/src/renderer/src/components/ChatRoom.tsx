import { fetchChats, sendMessage } from '@renderer/controller/ChatController';
import { useAuth } from '@renderer/model/AuthContext';
import { Chat } from '@renderer/model/Chat';
import { useEffect, useState } from 'react';

function ChatRoom(): JSX.Element {
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState<string>('');
  const [currChat, setCurrChat] = useState<'' | 'global' | 'private' | 'department' | 'mydept'>(
    'global'
  );
  const [department, setDepartment] = useState<string>('');
  const departments = [
    'Customer Service Manager',
    'Information Desk Staff',
    'Lost and Found Staff',
    'Check-in Staff',
    'Gate Agents',
    'Airport Operations Manager',
    'Flight Operations Manager',
    'Ground Handling Manager',
    'Ground Handling Staff',
    'Landside Operations Manager',
    'Maintenance Manager',
    'Maintenance Staff',
    'Customs and Border Control Officers',
    'Baggage Security Supervisor',
    'Baggage Security Staff',
    'Cargo Manager',
    'Logistics Manager',
    'Fuel Manager',
    'Cargo Handlers',
    'Civil Engineering Manager',
    'Airport Director/CEO',
    'Chief Financial Officer (CFO)',
    'Chief Operations Officer (COO)',
    'Chief Security Officer (CSO)',
    'Human Resources Director (HRD)'
  ];

  const departmentsValue = [
    'customer_service_manager',
    'information_desk_staff',
    'lost_and_found_staff',
    'check_in_staff',
    'gate_agents',
    'airport_operations_manager',
    'flight_operations_manager',
    'ground_handling_manager',
    'ground_handling_staff',
    'landside_operations_manager',
    'maintenance_manager',
    'maintenance_staff',
    'customs_and_border_control_officers',
    'baggage_security_supervisor',
    'baggage_security_staff',
    'cargo_manager',
    'logistics_manager',
    'fuel_manager',
    'cargo_handlers',
    'civil_engineering_manager',
    'airport_director_ceo',
    'chief_financial_officer_cfo',
    'chief_operations_officer_coo',
    'chief_security_officer_cso',
    'hrd'
  ];

  const role = user?.role ? user.role : '';
  const name = user?.name ? user.name : '';
  const canGlobalChat =
    role === 'Customer Service Manager' ||
    role === 'COO' ||
    role === 'Cargo Handlers' ||
    role === 'Baggage Security Supervisor' ||
    role === 'Customs and Border Control Officers' ||
    role === 'Landside Operations Manager' ||
    role === 'Ground Handling Manager' ||
    role === 'Airport Operations Manager' ||
    role === 'Gate Agents';

  const canPrivateChat = role === 'Maintenance Manager' || role === 'Maintenance Staff';

  const canDepartmentChat =
    role === 'Information Desk Staff' ||
    role === 'Check-in Staff' ||
    role === 'Cargo Manager' ||
    role === 'Lost and Found Staff' ||
    role === 'Flight Operations Manager' ||
    role === 'Logistics Manager' ||
    role === 'Civil Engineering Manager' ||
    role === 'CSO';

  useEffect(() => {
    fetchChats(currChat, department, role).then((chats) => {
      setChats(chats);
    });
  }, [message, currChat, department]);

  const handleSendMessage = (): void => {
    sendMessage(message, name, currChat, department);
    setMessage('');
  };

  const chatsGroupedByDate = chats.reduce(
    (groups, chat) => {
      const date = new Date(chat.created_at.toDate()).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chat);
      return groups;
    },
    {} as { [key: string]: Chat[] }
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <button
          className={`mr-2 p-2 ${
            currChat === 'global' ? 'bg-blue-500' : 'bg-slate-500'
          } text-white`}
          onClick={() => (currChat !== 'global' ? setCurrChat('global') : setCurrChat(''))}
        >
          Global Chat
        </button>
        {canDepartmentChat && (
          <button
            className={`mr-2 p-2 ${
              currChat === 'department' ? 'bg-blue-500' : 'bg-slate-500'
            } text-white`}
            onClick={() =>
              currChat !== 'department' ? setCurrChat('department') : setCurrChat('')
            }
          >
            Other Department Chat
          </button>
        )}
        {canPrivateChat && (
          <button
            className={`mr-2 p-2 ${
              currChat === 'private' ? 'bg-blue-500' : 'bg-slate-500'
            } text-white`}
            onClick={() => (currChat !== 'private' ? setCurrChat('private') : setCurrChat(''))}
          >
            Internal Staff Chat
          </button>
        )}
        <button
          className={`mr-2 p-2 ${
            currChat === 'mydept' ? 'bg-blue-500' : 'bg-slate-500'
          } text-white`}
          onClick={() => (currChat !== 'mydept' ? setCurrChat('mydept') : setCurrChat(''))}
        >
          {role} Department Chat
        </button>
        {currChat === 'department' && (
          <select
            className="border p-2"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((department, index) => (
              <option key={index} value={departmentsValue[index]}>
                {department}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex-1 overflow-y-scroll p-4">
        {chats.length === 0 && (
          <p className="flex flex-col items-center justify-center font-bold mt-4">
            No chats found.
          </p>
        )}
        {Object.entries(chatsGroupedByDate).map(([date, chatsForDate], index) => (
          <div key={index}>
            <h2 className="flex flex-col justify-center items-center text-gray-400">{date}</h2>
            {chatsForDate.map((chat, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold text-blue-500">{chat.sender}:</span> {chat.message}
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(chat.created_at.toDate()).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {((canGlobalChat && currChat === 'global') ||
        (canPrivateChat && currChat === 'private') ||
        (canDepartmentChat && currChat === 'department')) && (
        <div className="p-4">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="mt-2 p-2 bg-blue-500 text-white" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;

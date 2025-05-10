import { ScheduleMember } from '@/types/schedule';
import React from 'react';

interface SelectedMembersProps {
  members: ScheduleMember[];
  currentUserId: number;
  onRemoveUser?: (userId: number) => void;
}

export default function SelectedMembers({
  members,
  currentUserId,
  onRemoveUser,
}: SelectedMembersProps) {
  if (!members || members.length === 0) return null;
  console.log(members, currentUserId);

  return (
    <div className="mt-4">
      <ul className="mt-2 space-y-2">
        {members.map((member) => (
          <li
            key={member.memberId}
            className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2"
          >
            <span>{member.nickname}</span>
            {onRemoveUser && member.memberId !== currentUserId && (
              <button
                type="button"
                onClick={() => onRemoveUser(member.memberId)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

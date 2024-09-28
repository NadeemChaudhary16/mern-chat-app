import React from "react";
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      className={`inline-block px-2 py-1 m-1 mb-2 text-xs rounded cursor-pointer bg-purple-500 text-white`}
      onClick={handleFunction}
    >
      {user.name}
      {admin._id === user._id && <span>(Admin)</span>}
      <span className="pl-2 font-bold">X</span>
    </span>
  );
};

export default UserBadgeItem;

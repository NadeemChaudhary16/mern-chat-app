import React from "react";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center cursor-pointer bg-gray-200 p-2 mb-2 rounded-md text-black w-full  hover:bg-indigo-700 hover:text-white transition-colors duration-300"
    >
      <div>
        <div className="">{user.name}</div>
        <div className="text-sm">
          <b>Email: </b>
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;

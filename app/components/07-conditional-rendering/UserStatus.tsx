interface UserStatusProps {
  loggedIn: boolean;
  isAdmin: boolean;
}

const UserStatus = (props: UserStatusProps) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      {props.loggedIn && props.isAdmin && <p className="text-green-600 font-bold">Welcome Admin!</p>}
      {props.loggedIn && !props.isAdmin && <p className="text-blue-600">Welcome User!</p>}
      {!props.loggedIn && <p className="text-red-600">Please log in.</p>}
    </div>
  );
};

export default UserStatus;

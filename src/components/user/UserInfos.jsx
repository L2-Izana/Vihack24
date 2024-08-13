import { FaUserCog, FaBell, FaHeart } from "react-icons/fa";

const iconMapping = {
  profile: FaUserCog,
  notifications: FaBell,
  favorites: FaHeart,
};

export default function UserInfos({ clickToNavigate }) {
  const userInfos = ["profile", "notifications", "favorites"];

  return (
    <div className="space-y-4">
      {userInfos.map((userInfo) => (
        <UserInfoElement
          clickToNavigate={clickToNavigate}
          infoContent={userInfo}
        />
      ))}
    </div>
  );
}

const UserInfoElement = ({ clickToNavigate, infoContent }) => {
  // Create a route and get the icon based on the infoContent
  const infoRoute = `/${infoContent}`;
  const Icon = iconMapping[infoContent] || FaUserCog;

  return (
    <div
      onClick={() => clickToNavigate(infoRoute)}
      className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
    >
      <Icon className="text-3xl text-blue-600 mr-4" />
      <span className="text-gray-700 text-lg">
        {infoContent.charAt(0).toUpperCase() + infoContent.slice(1)}
      </span>
    </div>
  );
};

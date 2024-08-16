import { FaSmile, FaMeh, FaFrown, FaDollarSign } from "react-icons/fa";

const levelIcons = {
  1: <FaFrown className="text-red-500" />,
  2: <FaMeh className="text-yellow-500" />,
  3: <FaSmile className="text-green-500" />,
  4: <FaSmile className="text-yellow-300" />,
  5: <FaSmile className="text-yellow-400" />,
};

const budgetIcons = {
  1: <FaDollarSign className="text-yellow-100" />,
  2: <FaDollarSign className="text-yellow-200" />,
  3: <FaDollarSign className="text-yellow-300" />,
  4: <FaDollarSign className="text-yellow-400" />,
  5: <FaDollarSign className="text-yellow-500" />,
};

export { levelIcons, budgetIcons };

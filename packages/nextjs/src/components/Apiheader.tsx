import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [toggleOption, setToggleOption] = useState("stock");
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (option: string) => {
    setToggleOption(option);
    router.push(`/${option}`);
  };

  return (
    <header className="text-white bg-black body-font h-[6vh] flex items-center">
      <div className="container mx-auto flex justify-between items-center px-5">
        <nav className="flex items-center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link href="/verify" passHref>
                Verify
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/ffnillion" passHref>
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link href="/" passHref>
                Home
              </Link>
            </MenuItem>
          </Menu>
        </nav>
        <div className="flex items-center">
          <div className="flex bg-gray-800 rounded-md p-1">
            <button
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                toggleOption === 'stock' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => handleToggle('stock')}
            >
              Stock
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                toggleOption === 'stake' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => handleToggle('stake')}
            >
              Stake
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
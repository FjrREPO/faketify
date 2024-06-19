import { ThemeToggle } from '../theme/theme-toggle';
import UserButton from '../auth/user-button';

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  );
}

function DesktopNavbar() {
  return (
    <div
      className="flex absolute inset-0 z-40 h-fit w-full"
    >
      <nav className="flex items-center justify-end w-full">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

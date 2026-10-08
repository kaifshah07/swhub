import Container from "@/components/ui/container";
import Logo from "../logo/logo";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import UserActions from "./UserActions";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-slate-50/95 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-8">
          <Logo />

          <SearchBar />

          <Navigation />

          <UserActions />
        </div>
      </Container>
    </header>
  );
}


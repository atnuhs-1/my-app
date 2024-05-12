import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="py-4">
      <nav className="container flex item-center justify-between">
        <span>ロゴ</span>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant="outline">ログイン</Button>
          </SignInButton>
          <SignUpButton>
            <Button>新規登録</Button>
          </SignUpButton>
        </SignedOut>
      </nav>
    </header>
  );
}

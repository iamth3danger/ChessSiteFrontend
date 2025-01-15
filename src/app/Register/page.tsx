import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { headers } from "next/headers";

async function createAccount(formData: FormData) {
  "use server";

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  fetch("http://localhost:8080/api/users", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

export default function Register() {
  return (
    <div className="mt-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Chessable</CardTitle>
          <CardDescription>
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Chess.com Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#508ca6] hover:bg-[#4162ba]"
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

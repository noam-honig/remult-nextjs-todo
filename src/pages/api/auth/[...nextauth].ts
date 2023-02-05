import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import { UserInfo } from "remult";

const validUsers: UserInfo[] = [
  { id: "1", name: "Jane", roles: ["admin"] },
  { id: "2", name: "Steve" }
]

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        name: {
          label: "Username",
          placeholder: "Try Steve or Jane"
        }
      },
      authorize:
        credentials =>
          validUsers.find(user => user.name === credentials?.name) || null

    })
  ]
})

export async function getUserFromNextAuth(req: NextApiRequest) {
  const token = await getToken({ req });
  return validUsers.find(user => user.id === token?.sub)
}
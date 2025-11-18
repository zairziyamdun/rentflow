// import { jwtDecode } from "jwt-decode"

// interface TokenPayload {
//   role: string
//   userId: string
//   exp: number
// }

// export function getUserRole(token: string): string {
//   try {
//     const decoded: TokenPayload = jwtDecode(token)
//     return decoded.role || "tenant"
//   } catch {
//     return "tenant"
//   }
// }

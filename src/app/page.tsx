import { redirect } from "next/navigation";
import { appRoutes } from "@/constants/appRoutes";

export default async function Home() {
  redirect(appRoutes.transactions);

  // const session = await getServerAuthSession();
  // return (
  //   <div>
  //     <p>{session && <span>Logged in as {session.user?.name}</span>}</p>
  //     <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
  //       {session ? "Sign out" : "Sign in"}
  //     </Link>
  //   </div>
  // );
}

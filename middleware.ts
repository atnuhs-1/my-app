import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
  ]);

export default clerkMiddleware((auth, req) => {
    // if (!isPublicRoute(req)) auth().protect();
    console.log(auth().userId)

    const { userId, sessionClaims, redirectToSignIn } = auth();
    console.log("-----middleware------")
    console.log(sessionClaims)

    // For users visiting /onboarding, don't try to redirect
    if (userId && isOnboardingRoute(req)) {
      return NextResponse.next();
    }

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req))
      return redirectToSignIn({ returnBackUrl: req.url });

    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboading route to complete onboarding
    if (userId && !sessionClaims?.metadata?.onboarded) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If the user is logged in and the route is protected, let them view.
    if (userId && !isPublicRoute(req)) return NextResponse.next();
  
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
// import { authMiddleware, clerkClient, redirectToSignIn } from '@clerk/nextjs';
// import { NextResponse } from 'next/server';

// authMiddleware({
//   publicRoutes: ['/'],
//   async afterAuth(auth, req) {
//     if (!auth.userId && auth.isPublicRoute) {
//       return;
//     }

//     // 未ログインかつ非公開ルートへのアクセスはログイン画面へリダイレクト
//     if (!auth.userId && !auth.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }

//     // セッションにオンボーディングの完了ステータスがあるか確認
//     let onboarded = auth.sessionClaims?.onboarded;

//     if (!onboarded) {
//       // セッションになければClerkユーザー情報からステータスを取得
//       const user = await clerkClient.users.getUser(auth.userId!);
//       onboarded = user.publicMetadata.onboarded;
//     }

//     // オンボーディング前ならオンボーディングページへリダイレクト
//     if (!onboarded && req.nextUrl.pathname !== '/onboarding') {
//       const orgSelection = new URL('/onboarding', req.url);
//       return NextResponse.redirect(orgSelection);
//     }

//     // オンボーディング済みでオンボーディングページへアクセスしたらトップページへリダイレクト
//     if (onboarded && req.nextUrl.pathname === '/onboarding') {
//       const orgSelection = new URL('/', req.url);
//       return NextResponse.redirect(orgSelection);
//     }
//   },
// });
export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/admin/login');
      
      if (isOnAdmin && !isOnLogin) {
        if (isLoggedIn) return true;
        return false;
      }
      
      return true;
    },
  },
  providers: [],
};

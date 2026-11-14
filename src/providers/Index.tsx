import { GlobalProgressProvider } from "./GlobalProgressProvider";
import { AuthProvider } from "./AuthProvider";
import { ErrorProvider } from "./ErrorProvider";
import { LessonsProvider } from "./LessonsProvider";

type Props = {
  children: React.ReactNode,
}
function InitProvider ({children}: Props) {
  return (
    <ErrorProvider>
      <GlobalProgressProvider>
        <AuthProvider>
          <LessonsProvider>
            {children}
          </LessonsProvider>
        </AuthProvider>
      </GlobalProgressProvider>
    </ErrorProvider>
  );
}
export default InitProvider;
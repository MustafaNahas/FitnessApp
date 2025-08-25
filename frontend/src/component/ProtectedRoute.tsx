
import {Navigate} from "react-router-dom";

type ProtectedRouteProps = {
    user: string | null;
    children: React.ReactNode;
}
export default function ProtectedRoute({ user, children }: Readonly<ProtectedRouteProps>) {
    if (user === null) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
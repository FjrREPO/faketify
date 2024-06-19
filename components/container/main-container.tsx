import Navbar from "../bar/navbar";
import SidebarComponent from "../bar/sidebar";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full isolate p-8">
            <div className="main-container">
                <div className="leftside">
                    <SidebarComponent />
                </div>
                <div className="rightside w-full">
                    <Navbar/>
                    <div className="w-full h-full pt-12 pl-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

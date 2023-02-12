import { CircleButton } from "../circle-button";
import { ViewSwitcher } from "../view-switcher";
import { RightSidebarOff, SearchOff } from "../../icons";


export function Header() {
    return (
        <div className="h-[4.25rem] flex flex-col">
            <div className="flex-grow pb-px flex justify-around items-center">
                <div className="text-[1.125rem] font-medium">CelestiaScan</div>
                <div className="flex gap-6 items-center">
                    <ViewSwitcher />
                    <div className="flex gap-4 items-center">
                        <CircleButton><SearchOff/></CircleButton>
                        <CircleButton><RightSidebarOff/></CircleButton>
                    </div>
                </div>
            </div>
            <div className="w-full h-px bg-night opacity-[.04]"></div>
        </div>
    )
}
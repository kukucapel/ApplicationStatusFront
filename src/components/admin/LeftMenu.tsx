import Button from '../ui/Button';

interface LeftMenuProps {
    page: number;
    MENU: [string, string][];
    handleClickMenu: (state: number) => void;
}

export default function LeftMenu({
    MENU,
    page,
    handleClickMenu,
}: LeftMenuProps) {
    return (
        <aside className="lg:w-64 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border flex flex-col gap-2 border-gray-200 p-4">
                {MENU.map((button, index) => (
                    <Button
                        styleColor="white"
                        isActive={page === index}
                        className="w-full py-2 shadow-none font-normal"
                        key={index}
                        onClick={() => handleClickMenu(index)}
                    >
                        {button[0]}
                    </Button>
                ))}
            </div>
        </aside>
    );
}

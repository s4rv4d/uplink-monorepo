import uplinkLogo from "../../../public/uplink-logo.svg";
import WalletConnectButton from "@/ui/ConnectButton/WalletConnectButton";
import UplinkImage from "@/lib/UplinkImage"


const Nav = async () => {
  const version = '1.13.5';
  return (
    <nav className="h-20 w-full bg-base-100 hidden md:flex">
      <div className="flex px-3 py-3 w-11/12 ml-auto mr-auto">
        <div className="flex items-center justify-center mr-auto gap-2">
          <UplinkImage
            src={uplinkLogo}
            alt="uplink logo"
            height={28}
            width={28}
            className="flex md:hidden"
          />
          <div className="flex gap-2 items-center justify-center">
            <p className="text-lg text-white font-bold">Uplink</p>
            <p className={`badge border-none badge-sm bg-base-200 text-t2`}>
              {version}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Nav;

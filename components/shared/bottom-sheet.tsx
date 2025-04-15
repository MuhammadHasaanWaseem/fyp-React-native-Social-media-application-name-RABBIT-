import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet"
import { useAuth } from "@/providers/AuthProviders";
import { Divider } from "../ui/divider";
import { onShareProfile } from "@/lib/shareprofile";
import { router } from "expo-router";


export default ({ showActionsheet, setShowActionsheet }: { showActionsheet: boolean, setShowActionsheet: (show: boolean) => void }) => {
  const { logOut, user } = useAuth();
  const handlelogout = () => {
    handleClose();
    logOut();
  }
  const handleClose = () => setShowActionsheet(false)

  {/* user info action sheet here */ }
  return (

    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ backgroundColor: '#0A0A0A', borderColor: 'grey' }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetItem >
          <ActionsheetItemText style={{ color: "white" }}>Username : {user?.username}</ActionsheetItemText>
        </ActionsheetItem>
        <Divider />
        <ActionsheetItem >
          <ActionsheetItemText style={{ color: "white" }}>User id :{user?.id}</ActionsheetItemText>
        </ActionsheetItem>
        <Divider />

        <ActionsheetItem >
          <ActionsheetItemText style={{ color: "white" }}>Account Created at :{user?.created_at}</ActionsheetItemText>
        </ActionsheetItem>
        <Divider />
        

        <ActionsheetItem onPress={handlelogout}>
          <ActionsheetItemText style={{ color: '#FF4500' }}>Logout?</ActionsheetItemText>
        </ActionsheetItem>
        <Divider />
       

        <ActionsheetItem onPress={handleClose}>
          <ActionsheetItemText style={{ color: "white" }}>Close</ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  )
}
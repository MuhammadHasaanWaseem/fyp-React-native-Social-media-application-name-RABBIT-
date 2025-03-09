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


  export default ({showActionsheet, setShowActionsheet}:{showActionsheet:boolean, setShowActionsheet:(show:boolean)=>void})=>{
      const {logOut,user} =useAuth();
    const handlelogout =()=>{
      handleClose();
      logOut();
    }
    const handleClose = () => setShowActionsheet(false)

{/* user info action sheet here */}
return(

<Actionsheet  isOpen={showActionsheet} onClose={handleClose}>
<ActionsheetBackdrop />
<ActionsheetContent style={{backgroundColor:'#141414',borderColor:'grey'}}>
  <ActionsheetDragIndicatorWrapper>
    <ActionsheetDragIndicator />
  </ActionsheetDragIndicatorWrapper>
  <ActionsheetItem >
    <ActionsheetItemText  style={{color:"white"}}>Username : {user?.username}</ActionsheetItemText>
  </ActionsheetItem>
  <ActionsheetItem >
    <ActionsheetItemText style={{color:"white"}}>User id :{user?.id}</ActionsheetItemText>
  </ActionsheetItem>
  <ActionsheetItem >
    <ActionsheetItemText style={{color:"white"}}>Account Created at :{user?.created_at}</ActionsheetItemText>
  </ActionsheetItem>
  <ActionsheetItem onPress={handlelogout}>
    <ActionsheetItemText style={{color:'red'}}>Logout?</ActionsheetItemText>
  </ActionsheetItem>         
  <ActionsheetItem onPress={handleClose}>
    <ActionsheetItemText>Close</ActionsheetItemText>
  </ActionsheetItem>
</ActionsheetContent>
</Actionsheet>
)
}
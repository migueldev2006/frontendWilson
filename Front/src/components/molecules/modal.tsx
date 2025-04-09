import {
        Modal,
        ModalContent,
        ModalHeader,
        ModalBody,

} from "@heroui/modal";

type PropsModal = {
        ModalTitle: string
        children: React.ReactNode
        isOpen?: boolean
        onOpenChange?: () => void

}
export default function Modall({ ModalTitle, children, isOpen, onOpenChange }: PropsModal) {


        return (

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" isDismissable={false} >
                        <ModalContent>

                                <>
                                        <ModalHeader className="flex flex-col gap-1 text-center">{ModalTitle}</ModalHeader>
                                        <ModalBody>{children}</ModalBody>

                                </>

                        </ModalContent>

                </Modal>


        )
}
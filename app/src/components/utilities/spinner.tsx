import * as React from 'react';
import Modal from 'react-responsive-modal'

type props = {
    notice: string
}

export default class Spinner extends React.Component<props, {}> {
    public render() {
        return <div>
            <Modal
                open={true}
                onClose={() => { }}
                classNames={{
                    overlay: 'spinner-overlay',
                    modal: 'spinner-modal'
                }}
                animationDuration={1000}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                showCloseIcon={false}
                center>
                <div className="loader"></div>
                <div>{this.props.notice}</div>
            </Modal>
        </div>
    }
}
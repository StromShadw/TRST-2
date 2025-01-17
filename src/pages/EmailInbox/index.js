import React from 'react';
import { Container } from 'reactstrap';
import EmailToolbar from './EmailToolbar';

const MailInbox = () => {
    document.title="Mailbox | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <EmailToolbar />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MailInbox;
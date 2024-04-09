import React from 'react';
import { request } from '../axios_helper';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; // Import Button

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    };

    componentDidMount() {
        // It seems like the endpoint might be incorrect for registration details.
        // You might want to update this to point to a registration-specific endpoint in the future.
        request('GET', '/login', {}).then((response) => {
            this.setState({ data: response.data });
        });
    };

    render() {
        return (
            <div class="size-1/2">
                <Card title="Register" className="p-mb-2 size-full flex justify-center items-center rounded-xl">
                    <div className="card space-y-6">
                        <div className="p-fluid">
                            <FloatLabel>
                                <InputText id="email" type="text" />
                                <label htmlFor="email">Email</label>
                            </FloatLabel>
                        </div>
                        <div className="p-fluid">
                            <FloatLabel>
                                <InputText id="username" type="text" />
                                <label htmlFor="username">Username</label>
                            </FloatLabel>
                        </div>
                        
                        <div className="p-fluid">
                            <FloatLabel>
                                <InputText id="password" type="password" />
                                <label htmlFor="password">Password</label>
                            </FloatLabel>
                        </div>
                        <div className="p-fluid">
                            <FloatLabel>
                                <InputText id="repeatPassword" type="password" />
                                <label htmlFor="repeatPassword">Repeat Password</label>
                            </FloatLabel>
                        </div>

                        <div className="p-fluid flex justify-center">
                            <Button label="Register" className="p-button-raised" />
                        </div>

                        <div className="p-fluid flex justify-center">
                            <Button label="Already have an account? Login" onClick={this.props.onToggle} className="p-button-text" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };
}

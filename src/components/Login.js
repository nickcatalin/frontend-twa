import React from 'react';
import { request } from '../axios_helper';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; // Make sure to import Button

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    };

    componentDidMount() {
        request('GET', '/login', {}).then((response) => {
            this.setState({ data: response.data });
        });
    };

    render() {
        return (
            <div class="size-1/2">
                <Card title="Login" className="p-mb-2 size-full flex justify-center items-center rounded-xl">
                <div className="card space-y-6">
                    <div className="p-fluid">
                        <FloatLabel>
                            <InputText id="email" type="text" />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div className="p-fluid">
                        <FloatLabel>
                            <InputText id="password" type="password" />
                            <label htmlFor="password">Password</label>
                        </FloatLabel>
                    </div>

                    <div className="p-fluid flex justify-center">
                        <Button label="Login" className="p-button-raised" />
                    </div>

                    <div className="p-fluid flex justify-center">
                        <Button label="Don't have an account? Register" onClick={this.props.onToggle} className="p-button-text" />
                    </div>
                </div>
                </Card>
            </div>
        );
    };
}

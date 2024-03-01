import { Module, customModule, Container, VStack } from '@ijstech/components';
import { ScomStorage } from '@scom/scom-storage';

@customModule
export default class Module1 extends Module {
    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-scom-storage
                    cid="bafybeiadhh6b33tyybyi6gp6tcykcyak3fyqkqt4a5iz6cvkkd476jdkea"
                    transportEndpoint="http://localhost:8088"
                ></i-scom-storage>
            </i-panel>
        )
    }
}
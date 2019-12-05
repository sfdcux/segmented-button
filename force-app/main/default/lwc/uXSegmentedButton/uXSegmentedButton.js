import { LightningElement, api, track, wire } from 'lwc';
import getPicklistValuesForRecord from '@salesforce/apex/N3PicklistUtils.getPicklistValuesForRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

export default class SegmentedButton extends LightningElement {


    @api recordId;
    @api pickListField;

    @track label;
    @track helptext;
    @track required;
    @track options;
    @track error;
    @track ready = false;
    @track loading = false;
    @track _wiredResult;
    @track _wiredObject;

    selectedValue;

    @wire(getRecord, { recordId: '$recordId' , fields: '$pickListField' })
    theRecord(result)
    {
        this._wiredResult = result;
        this.loadPicklistValues();
    }

    @wire(getObjectInfo, { objectApiName: '$sobjectName'})
    theObject(result)
    {
        this._wiredObject = result;
    }

    loadPicklistValues()
    {
        getPicklistValuesForRecord({ recordId: this.recordId, fieldName: this.pickListField })
            .then(result => {
                this.options = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.options = undefined;
            }).finally(() => {
                this.label = this._wiredObject.data.fields[this.fieldName].label;
                this.helptext = this._wiredObject.data.fields[this.fieldName].inlineHelpText;
                this.required = this._wiredObject.data.fields[this.fieldName].required;
                this.ready = true;
            });
    }
    
    connectedCallback() 
    {
        this.loadPicklistValues();  
    }

    get sobjectName()
    {
        return this.pickListField.substr(0, this.pickListField.indexOf('.'));
    }

    get fieldName()
    {
        return this.pickListField.substr(this.pickListField.indexOf('.')+1); 
    }

    @api
    updateValue(ev)
    {
        this.loading = true;
        var selectedValue = null;

        this.options.forEach(function (opt) {
            if(opt.value === ev.target.value) 
            {
                opt.selected = !opt.selected;
                if(opt.selected) selectedValue = opt.value;
            }
            else
            {
                opt.selected = false;
            }
        });

        const fields = {};
        fields['Id'] = this.recordId;
        fields[this.fieldName] = selectedValue;
        const recordInput = { fields };

        updateRecord(recordInput)
                .then(result => {
                    return refreshApex(this._wiredResult);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.message,
                            variant: 'error'
                        })
                    );
                }).finally(() => {
                    this.loading = false;
                });
        
    }
}
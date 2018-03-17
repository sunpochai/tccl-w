import { PageBaseComponent } from './../../../pagebase.component';
import { PlantService } from './../../../_services/masters/plant.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Plant } from '../../../_models/masters/plant';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { Company } from '../../../_models/masters/company';
import { CompanyService } from '../../../_services/masters/company.service';

@Component({
    selector: "master-plant-detail",
    templateUrl: "./plant-detail.component.html"
})
export class PlantDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public companyList: Array<Company>;
    public plant: Plant;
    public id: any;
    public action_type: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _plantService: PlantService, private _companyService: CompanyService
        , private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        this._companyService.getall().subscribe(data => {
            this.companyList = data;
            // console.log(data);
        });

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._plantService.get<Plant>(this.id).subscribe(data => {
                this.plant = data;
                this.action_type = 'update';
                super.unblockui('#m_form_1');
                // console.log(this.plant);
            });
        } else {
            this.plant = new Plant();
            this.action_type = 'add';
            super.unblockui('#m_form_1');
            // console.log(this.plant);
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-plant-detail',
            ['assets/tccl/masters/plant/plant-detail.js']);
    }

    save() {
        // console.log(this.plant);
        if (this.id != null && this.id != '0') {
            this.update();
        } else {
            this.create();
        }
    }

    create() {
        super.blockui('#m_form_1');
        this.plant.create_user = super.getADUserLogin();
        this.plant.create_username = super.getFullNameUserLogin();
        this.plant.create_datetime = new Date();
        this.plant.update_user = super.getADUserLogin();
        this.plant.update_username = super.getFullNameUserLogin();
        this.plant.update_datetime = this.plant.create_datetime;
        this._plantService.create<Plant>(this.plant).subscribe(resp => {
            this.plant = resp;
            super.showsuccess(this.plant.plant_code + ' create complete');
            this._router.navigate(['/masters/plant/list']);
        },
        error => {
            alert(error);
            super.showError(error);
            super.unblockui('#m_form_1');
        },
        () => {
            super.unblockui('#m_form_1');
        });
    }

    update() {
        super.blockui('#m_form_1');
        this.plant.update_user = super.getADUserLogin();
        this.plant.update_username = super.getFullNameUserLogin();
        this.plant.update_datetime = new Date();
        this._plantService.put<Plant>(this.plant).subscribe(resp => {
            this.plant = resp;
            super.showsuccess(this.plant.plant_code + ' update complete');
            this._router.navigate(['/masters/plant/list']);
        },
        error => {
            super.showError(error);
            super.unblockui('#m_form_1');
        },
        () => {
            super.unblockui('#m_form_1');
        });
    }

    navigate_list() {
        this._router.navigate(['/masters/plant/list']);
    }

}
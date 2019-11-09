import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    classNameNeedToReg: string;
    courseName: string;
    courseLocation: string;
    courseContent: string;
    teacherId: number;
    courses: CourseDto[] = [];
    coursesWithTN: CourseWithTNDto[] = [];
    regCourses: CourseDto[] = [];

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        debugger;
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    getAllCoursesWithReg() {
        this.courseService.getRegCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.regCourses = [];
            } else {
                this.regCourses = curDto;
            }
        });
    }

    registerCourse() {
        this.courseService.registerCourse(this.classNameNeedToReg).subscribe();
    }

    dropCourse(courseName: String) {
        this.courseService.dropCourse(courseName).subscribe();
    }

    clearAllCourses() {
        this.courses = [];
    }

    clearAllCoursesWithTN() {
        this.coursesWithTN = [];
    }

    clearAllRegCourses() {
        this.regCourses = [];
    }

    addCourse() {
        const courseDto: CourseDto = {
            courseName: this.courseName,
            courseLocation: this.courseLocation,
            courseContent: this.courseContent,
            teacherId: this.teacherId
        };
        this.courseService.addCourse(courseDto).subscribe();
    }

    deleteCourse(courseName: String) {
        this.courseService.delete(courseName).subscribe();
        //refresh data
    }

    addCourseToStudent(courseName: String) {
        this.courseService.registerCourse(courseName).subscribe();
        // const courseName = 'temp';
        //this.courseService.addCourseToStudent(courseName, currentUserCredential);
    }
}

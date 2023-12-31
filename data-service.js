const Sequelize = require('sequelize');
var sequelize = new Sequelize('dafvu1tl6l8q7k', 'wixoxnypzdkjsr', 'bc63615ca52d44c809c8567a4af25c237b5a06535ae365f5a5155eb28c06d41a', {
    host: 'ec2-35-171-41-147.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: {raw: true}
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.log('Unable to connect to the database:', err);
});

var Employee = sequelize.define('Employee',{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
    }, {
        createdAt: false, 
        updatedAt: false 
});

var Department = sequelize.define('Department',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }, {
        createdAt: false, 
        updatedAt: false 
});

Department.hasMany(Employee, {foreignKey: 'department'});


module.exports.initialize = function () {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then( (Employee) => {
            resolve();
        }).then((Department) => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        })
    });

};

module.exports.getAllEmployees = function () {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll());
        }).catch((err) => {
            reject("no results returned");
        });
    });

};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    status: status
                }}));
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    department: department
            }}));
        }).catch((err) => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    employeeManagerNum: manager
                }
            }));
            }).catch((err) => {
                reject("no results returned");
        });
    });
};

module.exports.getEmployeeByNum = function (num) {
    
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    employeeNum: num
                }
            }));
            }).catch((err) => {
                reject("no results returned");
        });
    });
};

module.exports.getDepartments = function(){

    return new Promise(function(resolve, reject){
        sequelize.sync().then(() => {
            resolve(Department.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
       
    });
};

module.exports.addEmployee = function (employeeData) {

    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let i in employeeData) {
                if(employeeData[i] == ""){
                    employeeData[i] = null;
                }
            }
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate}));
            }).catch(() => {
                reject("unable to create employee");
            });
        }).catch(() => {
            reject("unable to create employee");
    });
};

module.exports.updateEmployee = function (employeeData) {
    
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let i in employeeData) {
                if(employeeData[i] == ""){
                    employeeData[i] = null;
                }
            }
            resolve(Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressPostal: employeeData.addressPostal,
                addressState: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department
            }, { where: {
                employeeNum: employeeData.employeeNum
            }}));
        }).catch(() => {
            reject("unable to create employee.");
        });
    });
};

module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for(let i in departmentData){
                if(departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.create(departmentData)
            .then((data) => {
                resolve(data);
            }).catch((err) => {
                reject('unable to create department');
            });
        });
    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for(let x in departmentData){
                if(departmentData[x] == "") {
                    departmentData[x] = null;
                }
            }
            Department.update({
                departmentName: departmentData.departmentName
            }, { where: {
                departmentId: departmentData.departmentId
            }}).then(() =>{
                resolve(Department);
            }).catch((err) => {
                reject("unable to create department.");
            });
        }).catch(() => {
            reject("unable to create department.");
        });
    });
};

module.exports.getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll({
                where:{
                    departmentId: id
                }
            }));
            }).catch((err) => {
                reject("no results returned");
        });
    });
};

module.exports.deleteDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.destroy({
                where:{
                    departmentId: id
                }}));
        }).catch((err) => {
            reject("could not delete department");
        });
    });

};

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.destroy({
                where:{
                    employeeNum: empNum
                }}));
        }).catch((err) => {
            reject("could not delete employee");
        });
    });
};





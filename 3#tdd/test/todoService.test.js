const { describe, it, before, afterEach, beforeEach } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')

const TodoService = require('../src/todoService')
const Todo = require('../src/todo')

describe('todoService', () => {
    let sandbox

    before(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('#list', () => {
        const mockDatabase = [
            {
                name: 'leonardo',
                age: 22,
                meta: { revision: 0, created: 1611512857950, version: 0 },
                '$loki': 1
            },
        ]

        let todoService
        beforeEach(() => {
            const dependencies = {
                todoRepository: {
                    list: sandbox.stub().returns(mockDatabase)
                }
            }

            todoService = new TodoService(dependencies)
        })

        it('should return data on a specific format', () => {
            const result = todoService.list()
            const [{ meta, $loki, expected }] = mockDatabase

            expect(result).to.be.deep.equal([expected])
        })
    })

    describe('#create', () => {
        let todoService
        beforeEach(() => {
            const dependencies = {
                todoRepository: {
                    create: sandbox.stub().returns(true)
                }
            }

            todoService = new TodoService(dependencies)
        })

        it('shouldnt save todo item with invalid data', () => {
            const data = new Todo({
                text: '',
                when: ''
            })

            Reflect.deleteProperty(data, "id")

            const expected = {
                error: {
                    message: 'invalid data',
                    data: data
                }
            }

            const result = todoService.create(data)
            expect(result).to.be.deep.equal(expected)
        })

        it('should save todo item with late status when the property is further than today', () => {
            const properties = {
                text: 'I must walk my dog',
                when: new Date('2020-12-01 12:00:00 GMT-0')
            }
            const expectedId = '00001'

            const uuuid = require('uuid')
            const fakeUUID = sandbox.fake.returns(expectedId)
            sandbox.replace(uuuid, uuuid.v4.name, fakeUUID)

            const data = new Todo(properties)

            const today = new Date("2020-12-02")
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expectedCallWith = {
                ...data,
                status: "late"
            }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
        })

        it('should save todo with peding status', () => {
            const properties = {
                text: 'I must walk my dog',
                when: new Date('2020-12-01 12:00:00 GMT-0')
            }
            const expectedId = '00001'

            const uuuid = require('uuid')
            const fakeUUID = sandbox.fake.returns(expectedId)
            sandbox.replace(uuuid, uuuid.v4.name, fakeUUID)

            const data = new Todo(properties)

            const today = new Date("2020-12-01")
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expectedCallWith = {
                ...data,
                status: "pending"
            }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
        })
    })
})
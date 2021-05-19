"use strict";

exports.sampleData = [
    {
        taskName: 'VENTAS',
        // duration: 11,
        // progress: 66,
        subtasks: [
            {
                taskName: 'FASE 1',
                progress: 50,
                duration: 11,
                subtasks: [
                    {
                        taskName: 'PROYECTO "X"',
                        duration: 11,
                        progress: 10,
                        subtasks: [
                            {
                                taskName: 'ÁREA',
                                duration: 11,
                                progress: 10,
                                subtasks: [
                                    { taskName: 'SUBÁREA 1',  duration: 3, progress: '50' },
                                    { taskName: 'SUBÁREA 2',  duration: 3, progress: '50' },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        taskName: 'Implementation Phase',
        duration: 11,
        progress: 66,
        subtasks: [
            {
                taskName: 'Phase 1',
                progress: 50,
                duration: 11,
                subtasks: [
                    {
                        taskName: 'Implementation Module 1',
                        duration: 11,
                        progress: 10,
                        subtasks: [
                            {
                                taskName: 'Implementation Module 2',
                                duration: 11,
                                progress: 10,
                                subtasks: [
                                    { taskName: 'Development Task 1',  duration: 3, progress: '50' },
                                    { taskName: 'Development Task 2',  duration: 3, progress: '50' },
                                    { taskName: 'Testing', duration: 2, progress: '0' },
                                    { taskName: 'Bug fix', duration: 2, progress: '0' },
                                    { taskName: 'Customer review meeting', duration: 2, progress: '0' },
                                    { taskName: 'Phase 1 complete', duration: 0, progress: '50' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

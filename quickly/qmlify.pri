qmlify.output  = ${QMAKE_FILE_BASE}/resources.qrc
qmlify.commands = qmlify -d ${QMAKE_FILE_BASE} ${QMAKE_FILE_NAME}
qmlify.input = QMLIFY
qmlify.depend_command = qmlify ${QMAKE_FILE_NAME} --depends
qmlify.variable_out = RESOURCES
qmlify.CONFIG += target_predeps
QMAKE_EXTRA_COMPILERS += qmlify

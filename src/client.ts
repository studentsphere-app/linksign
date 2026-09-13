import type {
	Absence,
	AssessmentDetail,
	Assessments,
	AssessmentTime,
	AttendanceStatistics,
	AuthSession,
	CampusMapLocation,
	ContactDirectoryEntry,
	ContactsDirectoryQuery,
	CourseEntry,
	Documents,
	KnowledgeBasePost,
	NewAbsence,
	NewsFeedChannel,
	NewsFeedPostsQuery,
	NewsFeedPostsResponse,
	NotificationsPreferences,
	PaginatedData,
	PlanningEntry,
	Professor,
	RefreshedSession,
	SchoolAbsenceType,
	SchoolDocument,
	SchoolFeatures,
	SignByCodeRequest,
	SignByEmailRequest,
	SignByQRCodeRequest,
	StudentAccount,
	StudentAttachment,
	StudentProfile,
	SubmittedAbsence,
	SurveyAnswersRequest,
	SurveyDetails,
	SurveyEntry,
	Surveys,
	Training,
} from "@/models";
import {
	answerSurvey,
	getAbsences,
	getAssessmentDetailById,
	getAssessments,
	getAttendanceStatistics,
	getCourseByCode,
	getCoursesBetweenDates,
	getDocuments,
	getNotificationsPreferences,
	getPlanning,
	getPrivateCampusMapBySchool,
	getPrivateContactsDirectory,
	getPrivateKnowledgeBasePosts,
	getPrivateNewsFeedChannels,
	getPrivateNewsFeedPosts,
	getProfessors,
	getProfile,
	getPublicCampusMapBySchool,
	getPublicContactsDirectory,
	getPublicKnowledgeBasePosts,
	getPublicNewsFeedChannels,
	getPublicNewsFeedPosts,
	getSchoolAbsenceTypes,
	getSchoolFeatures,
	getSchools,
	getSchoolsByToken,
	getStudentAttachments,
	getSurveyById,
	getSurveys,
	getTrainings,
	loginWhitelabelAppWithCredentials,
	loginWithCredentials,
	logoutByRefreshToken,
	refreshTokenByRefreshToken,
	signByCode,
	signByEmail,
	signByQRCode,
	submitAbsence,
} from "@/services";
import { getTodayCourses } from "@/utils";

export interface LinksignClientOptions {
	deviceId?: string;
	refreshToken?: string;
	schoolId?: string;
	studentId?: string;
	onTokenRefreshed?: (tokens: {
		accessToken: string;
		refreshToken?: string;
	}) => void;
}

export class LinksignClient {
	public token: string;
	public options: LinksignClientOptions;

	constructor(token: string, options: LinksignClientOptions = {}) {
		this.token = token;
		this.options = options;
	}

	get deviceId(): string | undefined {
		return this.options.deviceId;
	}

	set deviceId(value: string | undefined) {
		this.options.deviceId = value;
	}

	get refreshTokenValue(): string | undefined {
		return this.options.refreshToken;
	}

	set refreshTokenValue(value: string | undefined) {
		this.options.refreshToken = value;
	}

	get schoolId(): string | undefined {
		return this.options.schoolId;
	}

	set schoolId(value: string | undefined) {
		this.options.schoolId = value;
	}

	get studentId(): string | undefined {
		return this.options.studentId;
	}

	set studentId(value: string | undefined) {
		this.options.studentId = value;
	}

	// ─── PLANNING & COURSES ───────────────────────────────────────────────────

	async getPlanning(start: string, end: string): Promise<PlanningEntry[]> {
		return getPlanning(this.token, start, end, this.deviceId);
	}

	async getCoursesBetweenDates(
		start: string,
		end: string,
	): Promise<CourseEntry[]> {
		return getCoursesBetweenDates(this.token, start, end, this.deviceId);
	}

	async getCourseByCode(code: string): Promise<CourseEntry> {
		return getCourseByCode(this.token, code, this.deviceId);
	}

	getTodayCourses(courses: CourseEntry[]): CourseEntry[] {
		return getTodayCourses(courses);
	}

	// ─── ATTENDANCE & ABSENCES ───────────────────────────────────────────────

	async getAttendanceStatistics(
		start: string,
		end: string,
		trainingId?: string | null,
	): Promise<AttendanceStatistics> {
		return getAttendanceStatistics(
			this.token,
			start,
			end,
			trainingId,
			this.deviceId,
		);
	}

	async getSchoolAbsenceTypes(): Promise<SchoolAbsenceType[]> {
		return getSchoolAbsenceTypes(this.token, this.deviceId);
	}

	async getAbsences(start: string, end: string): Promise<Absence[]> {
		return getAbsences(this.token, start, end, this.deviceId);
	}

	async submitAbsence(absence: NewAbsence): Promise<SubmittedAbsence> {
		return submitAbsence(this.token, absence, this.deviceId);
	}

	// ─── ASSESSMENTS & HOMEWORK ──────────────────────────────────────────────

	async getAssessments(time?: AssessmentTime): Promise<Assessments> {
		return getAssessments(this.token, time, this.deviceId);
	}

	async getAssessmentDetailById(id: string): Promise<AssessmentDetail> {
		return getAssessmentDetailById(this.token, id, this.deviceId);
	}

	// ─── NEWS FEED ───────────────────────────────────────────────────────────

	async getPrivateNewsFeedChannels(
		schoolId?: string,
		lang?: string,
	): Promise<NewsFeedChannel[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch private news feed channels",
			);
		}
		return getPrivateNewsFeedChannels(
			targetSchoolId,
			this.token,
			this.deviceId,
			lang,
		);
	}

	async getPrivateNewsFeedPosts(
		schoolId?: string,
		query?: NewsFeedPostsQuery,
		lang?: string,
	): Promise<NewsFeedPostsResponse> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error("schoolId is required to fetch private news feed posts");
		}
		return getPrivateNewsFeedPosts(
			targetSchoolId,
			this.token,
			query,
			this.deviceId,
			lang,
		);
	}

	async getPublicNewsFeedChannels(
		schoolId?: string,
		lang?: string,
	): Promise<NewsFeedChannel[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch public news feed channels",
			);
		}
		return getPublicNewsFeedChannels(targetSchoolId, lang);
	}

	async getPublicNewsFeedPosts(
		schoolId?: string,
		query?: NewsFeedPostsQuery,
		lang?: string,
	): Promise<NewsFeedPostsResponse> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error("schoolId is required to fetch public news feed posts");
		}
		return getPublicNewsFeedPosts(targetSchoolId, query, lang);
	}

	// ─── SIGNATURES ──────────────────────────────────────────────────────────

	async signByQRCode(
		qrCodeId: string | number,
		body: SignByQRCodeRequest,
	): Promise<unknown> {
		return signByQRCode(this.token, qrCodeId, body, this.deviceId);
	}

	async signByEmail(
		courseId: string,
		verificationToken: string,
		body: SignByEmailRequest,
	): Promise<unknown> {
		return signByEmail(
			this.token,
			courseId,
			verificationToken,
			body,
			this.deviceId,
		);
	}

	async signByCode(code: string, body: SignByCodeRequest): Promise<unknown> {
		return signByCode(this.token, code, body, this.deviceId);
	}

	// ─── DOCUMENTS & ATTACHMENTS ─────────────────────────────────────────────

	async getDocuments(): Promise<Documents<SchoolDocument>> {
		return getDocuments(this.token, this.deviceId);
	}

	async getStudentAttachments(): Promise<StudentAttachment[]> {
		return getStudentAttachments(this.token, this.deviceId);
	}

	async getProfessors(professorIds: string[]): Promise<Professor[]> {
		return getProfessors(this.token, professorIds, this.deviceId);
	}

	// ─── PROFILE & SCHOOL ────────────────────────────────────────────────────

	async getProfile(): Promise<StudentProfile> {
		const profile = await getProfile(this.token, this.deviceId);
		if (profile.SCHOOL_ID && !this.schoolId) {
			this.schoolId = profile.SCHOOL_ID;
		}
		if (profile.ID && !this.studentId) {
			this.studentId = profile.ID;
		}
		return profile;
	}

	async getSchools(): Promise<StudentAccount[]> {
		return getSchools(this.token, this.deviceId);
	}

	async getSchoolsByToken(): Promise<StudentAccount[]> {
		return getSchoolsByToken(this.token, this.deviceId);
	}

	async getNotificationsPreferences(): Promise<NotificationsPreferences> {
		return getNotificationsPreferences(this.token, this.deviceId);
	}

	async getSchoolFeatures(schoolId?: string): Promise<SchoolFeatures> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error("schoolId is required to fetch school features");
		}
		return getSchoolFeatures(this.token, targetSchoolId, this.deviceId);
	}

	// ─── SURVEYS ─────────────────────────────────────────────────────────────

	async getSurveys(): Promise<Surveys<SurveyEntry>> {
		return getSurveys(this.token, this.deviceId);
	}

	async getSurveyById(
		surveyId: string,
		schoolId?: string,
		studentId?: string,
	): Promise<SurveyDetails> {
		const targetSchoolId = schoolId ?? this.schoolId;
		const targetStudentId = studentId ?? this.studentId;
		if (!targetSchoolId || !targetStudentId) {
			throw new Error(
				"schoolId and studentId are required to fetch survey details",
			);
		}
		return getSurveyById(
			this.token,
			targetSchoolId,
			targetStudentId,
			surveyId,
			this.deviceId,
		);
	}

	async answerSurvey(
		surveyId: string,
		body: SurveyAnswersRequest,
		schoolId?: string,
		studentId?: string,
	): Promise<unknown> {
		const targetSchoolId = schoolId ?? this.schoolId;
		const targetStudentId = studentId ?? this.studentId;
		if (!targetSchoolId || !targetStudentId) {
			throw new Error("schoolId and studentId are required to answer a survey");
		}
		return answerSurvey(
			this.token,
			targetSchoolId,
			targetStudentId,
			surveyId,
			body,
			this.deviceId,
		);
	}

	// ─── TRAININGS ───────────────────────────────────────────────────────────

	async getTrainings(): Promise<Training[]> {
		return getTrainings(this.token, this.deviceId);
	}

	// ─── CAMPUS MAP & DIRECTORY ──────────────────────────────────────────────

	async getPrivateCampusMap(schoolId?: string): Promise<CampusMapLocation[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error("schoolId is required to fetch private campus map");
		}
		return getPrivateCampusMapBySchool(
			targetSchoolId,
			this.token,
			this.deviceId,
		);
	}

	async getPublicCampusMap(schoolId?: string): Promise<CampusMapLocation[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error("schoolId is required to fetch public campus map");
		}
		return getPublicCampusMapBySchool(targetSchoolId);
	}

	async getPrivateContactsDirectory(
		schoolId?: string,
		query?: ContactsDirectoryQuery,
	): Promise<PaginatedData<ContactDirectoryEntry>> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch private contacts directory",
			);
		}
		return getPrivateContactsDirectory(
			targetSchoolId,
			this.token,
			this.deviceId,
			query,
		);
	}

	async getPublicContactsDirectory(
		schoolId?: string,
		query?: ContactsDirectoryQuery,
	): Promise<PaginatedData<ContactDirectoryEntry>> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch public contacts directory",
			);
		}
		return getPublicContactsDirectory(targetSchoolId, query);
	}

	// ─── KNOWLEDGE BASE ──────────────────────────────────────────────────────

	async getPrivateKnowledgeBasePosts(
		schoolId?: string,
		lang?: string,
	): Promise<KnowledgeBasePost[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch private knowledge base posts",
			);
		}
		return getPrivateKnowledgeBasePosts(
			targetSchoolId,
			this.token,
			this.deviceId,
			lang,
		);
	}

	async getPublicKnowledgeBasePosts(
		schoolId?: string,
		lang?: string,
	): Promise<KnowledgeBasePost[]> {
		const targetSchoolId = schoolId ?? this.schoolId;
		if (!targetSchoolId) {
			throw new Error(
				"schoolId is required to fetch public knowledge base posts",
			);
		}
		return getPublicKnowledgeBasePosts(targetSchoolId, lang);
	}

	// ─── REFRESH & SESSION ───────────────────────────────────────────────────

	async refreshToken(): Promise<RefreshedSession> {
		if (!this.options.refreshToken) {
			throw new Error("No refreshToken provided for LinksignClient");
		}
		const refreshed = await refreshTokenByRefreshToken(
			this.options.refreshToken,
			this.deviceId,
		);
		this.token = refreshed.access_token;
		if (refreshed.refresh_token) {
			this.options.refreshToken = refreshed.refresh_token;
		}
		if (this.options.onTokenRefreshed) {
			this.options.onTokenRefreshed({
				accessToken: this.token,
				refreshToken: this.options.refreshToken,
			});
		}
		return refreshed;
	}

	async logout(): Promise<boolean> {
		if (this.options.refreshToken) {
			return logoutByRefreshToken(this.options.refreshToken, this.deviceId);
		}
		return true;
	}

	// ─── STATIC FACTORY METHODS ──────────────────────────────────────────────

	static async fromCredentials(
		identifier: string,
		password: string,
		language?: "fr" | "en" | "es",
		deviceId?: string,
	): Promise<{ client: LinksignClient; session: AuthSession }> {
		const session = await loginWithCredentials(
			identifier,
			password,
			language,
			deviceId,
		);
		const client = new LinksignClient(session.TOKEN, {
			deviceId,
			refreshToken: session.REFRESH_TOKEN,
		});
		return { client, session };
	}

	static async fromWhitelabelCredentials(
		identifier: string,
		password: string,
		schoolId: string,
		language?: "fr" | "en" | "es",
		deviceId?: string,
	): Promise<{ client: LinksignClient; session: AuthSession }> {
		const session = await loginWhitelabelAppWithCredentials(
			identifier,
			password,
			schoolId,
			language,
			deviceId,
		);
		const client = new LinksignClient(session.TOKEN, {
			deviceId,
			refreshToken: session.REFRESH_TOKEN,
			schoolId,
		});
		return { client, session };
	}

	static async fromRefreshToken(
		refreshToken: string,
		deviceId?: string,
		options: Omit<LinksignClientOptions, "refreshToken" | "deviceId"> = {},
	): Promise<{ client: LinksignClient; session: RefreshedSession }> {
		const session = await refreshTokenByRefreshToken(refreshToken, deviceId);
		const client = new LinksignClient(session.access_token, {
			...options,
			deviceId,
			refreshToken: session.refresh_token ?? refreshToken,
		});
		return { client, session };
	}
}

export { LinksignClient as EdusignClient };

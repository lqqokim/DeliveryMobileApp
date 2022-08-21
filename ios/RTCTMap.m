#import "RCTTMap.h"
#import "TMapTapi.h"

@implementation RCTTMap
- (instancetype)init
{
    // 모듈이 로딩될 때 실행되는 부분
    self = [super init];
    [TMapTapi setSKTMapAuthenticationWithDelegate:self apiKey:@"l7xxc797611346154cf998beea3e1c896753"]; // 여기에 여러분의 키 넣기
    return self;
}
- (dispatch_queue_t)methodQueue
{
    // 메인쓰레드만 쓰도록
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(TMap);

RCT_EXPORT_METHOD(openNavi: (NSString *)name longitude:(NSString *)longitude latitude:(NSString *)latitude vehicle:(NSString *)vehicle resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"y,x %@, %@", latitude, longitude);
    BOOL installed = [TMapTapi isTmapApplicationInstalled];
    if (installed) {
        CLLocationCoordinate2D centerCoordinate = {[latitude doubleValue], [longitude doubleValue]};
        BOOL flag = [TMapTapi invokeRoute:name coordinate: centerCoordinate];
        NSLog(flag ? @"Yes" : @"No");
        if (flag) {
            resolve(@(YES));
        } else {
            resolve(@(NO));
        }
    } else {
        resolve(@(NO));
    }
}

@end
